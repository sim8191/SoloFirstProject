package com.coca.backend.domain.member.service;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.coca.backend.domain.member.dao.MemberDao;
import com.coca.backend.domain.member.dto.MemberSignInRequest;
import com.coca.backend.domain.member.dto.MemberSignInResponse;
import com.coca.backend.domain.member.dto.MemberSignUpRequest;
import com.coca.backend.domain.member.dto.MemberSignUpResponse;
import com.coca.backend.domain.member.vo.Member;
import com.coca.backend.global.validation.PasswordPolicyValidator;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Primary
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
	
	private final MemberDao memberDao;
	
	// Spring Security의 비밀번호 해싱 객체 주입
	private final PasswordEncoder passwordEncoder;
	
	private static final String LOGIN_CREDENTIAL_MISMATCH_MESSAGE =
            "아이디 혹은 비밀번호가 일치하지 않습니다.";

	private void validateSignUpRequest(MemberSignUpRequest request) {
		if(request == null) {
			throw new IllegalArgumentException("회원가입 요청값이 없습니다.");
		}
		
		if (request.getUserId() == null || request.getUserId().isBlank()) {
            throw new IllegalArgumentException("아이디는 필수입니다.");
        }

		// 실제 비밀번호 정책 검증
		PasswordPolicyValidator.validate(request.getUserPwd());

		// 비밀번호 확인 필수 검사
		if (request.getPasswordConfirm() == null
		        || request.getPasswordConfirm().isBlank()) {
		    throw new IllegalArgumentException("비밀번호 확인은 필수입니다.");
		}

		// 실제 비밀번호와 확인 비밀번호 비교
		if (!request.getUserPwd().equals(request.getPasswordConfirm())) {
		    throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
		}

        if (request.getUserName() == null || request.getUserName().isBlank()) {
            throw new IllegalArgumentException("이름은 필수입니다.");
        }
	}
	
	
	@Override
    @Transactional
    public MemberSignUpResponse signUp(MemberSignUpRequest request) {
        // 1. 기본 유효성 및 정규식 검증
        validateSignUpRequest(request);

        // 3. 아이디 중복 검사
        if (memberDao.selectCountByUserId(request.getUserId()) > 0) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        // 5. DB 저장을 위한 Member 엔티티 생성 (평문 비번, 권한 3(일반홰원), 포인트 0)[cite: 1]
        Member member = Member.builder()
                .userId(request.getUserId().trim())
                .userPwd(passwordEncoder.encode(request.getUserPwd()))
                .userName(request.getUserName().trim())
                .authority(3)    
                .userPoint(0L)   
                .build();

        // 6. DB INSERT (MyBatis를 통해 SEQ_USER_NO 자동 채번)[cite: 1]
        memberDao.insertMember(member);

        // 7. 응답 반환
        return MemberSignUpResponse.builder()
                .userNo(member.getUserNo())
                .userId(member.getUserId())
                .userName(member.getUserName())
                .build();
    }

    @Override
    public MemberSignInResponse signIn(MemberSignInRequest request) {
        // 1. 필수 입력값 체크
        if (request == null || request.getUserId() == null || request.getUserId().isBlank()
                || request.getUserPwd() == null || request.getUserPwd().isBlank()) {
            throw new IllegalArgumentException(LOGIN_CREDENTIAL_MISMATCH_MESSAGE);
        }

        // 2. 아이디로 회원 조회
        Member member = memberDao.selectByUserId(request.getUserId());
        if (member == null) {
            throw new IllegalArgumentException(LOGIN_CREDENTIAL_MISMATCH_MESSAGE);
        }

        // 3. 탈퇴 계정 확인[cite: 1]
        if ("Y".equalsIgnoreCase(member.getUserDeleteYn())) {
            throw new IllegalArgumentException("탈퇴 처리된 계정입니다.");
        }

        // 사용자가 입력한 비밀번호와 DB에 저장된 BCrypt 해시 비교
        if (!passwordEncoder.matches(
                request.getUserPwd(),
                member.getUserPwd())) {

            throw new IllegalArgumentException(LOGIN_CREDENTIAL_MISMATCH_MESSAGE);
        }

        // 5. 로그인 성공 응답 반환[cite: 1]
        return MemberSignInResponse.builder()
                .userNo(member.getUserNo())
                .userId(member.getUserId())
                .userName(member.getUserName())
                .userEmail(member.getUserEmail())
                .authority(member.getAuthority())
                .userPoint(member.getUserPoint())
                .build();
    }
}
