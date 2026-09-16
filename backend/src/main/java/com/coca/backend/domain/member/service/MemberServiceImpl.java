package com.coca.backend.domain.member.service;

import java.util.regex.Pattern;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

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
	
	private static final String LOGIN_CREDENTIAL_MISMATCH_MESSAGE =
            "아이디 혹은 비밀번호가 일치하지 않습니다.";

    private static final Pattern PHONE_PATTERN =
            Pattern.compile("^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$");
	
	private void validateSignUpRequest(MemberSignUpRequest request) {
		if(request == null) {
			throw new IllegalArgumentException("회원가입 요청값이 없습니다.");
		}
		
		if (request.getUserId() == null || request.getUserId().isBlank()) {
            throw new IllegalArgumentException("아이디는 필수입니다.");
        }

        PasswordPolicyValidator.validate(request.getPasswordConfirm());

        if (request.getPasswordConfirm() == null || request.getPasswordConfirm().isBlank()) {
            throw new IllegalArgumentException("비밀번호 확인은 필수입니다.");
        }

        if (!request.getPasswordConfirm().equals(request.getPasswordConfirm())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        if (request.getUserName() == null || request.getUserName().isBlank()) {
            throw new IllegalArgumentException("이름은 필수입니다.");
        }

        String phone = normalizePhone(request.getUserPhone());
        if (!PHONE_PATTERN.matcher(phone).matches()) {
            throw new IllegalArgumentException("올바른 휴대전화 번호 형식이 아닙니다.");
        }
	}
	
	private String normalizePhone(String rawPhone) {
        return rawPhone.trim().replaceAll("\\s+", "");
    }
	
	
	@Override
    @Transactional
    public MemberSignUpResponse signUp(MemberSignUpRequest request) {
        // 1. 기본 유효성 및 정규식 검증
        validateSignUpRequest(request);

        // 2. 이메일 정규화 (대소문자 통일 및 공백 제거)
        String email = normalizeEmail(request.getUserEmail());

        // 3. 아이디 중복 검사
        if (memberDao.selectCountByUserId(request.getUserId()) > 0) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        // 4. 이메일 중복 검사
        if (email != null && !email.isBlank()) {
            if (memberDao.selectCountByEmail(email) > 0) {
                throw new IllegalArgumentException("이미 가입된 이메일입니다.");
            }
        }

        // 5. DB 저장을 위한 Member 엔티티 생성 (평문 비번, 권한 1, 포인트 0)[cite: 1]
        Member member = Member.builder()
                .userId(request.getUserId().trim())
                .userPwd(request.getUserPwd())
                .userName(request.getUserName().trim())
                .userEmail(email)
                .userPhone(normalizePhone(request.getUserPhone()))
                .authority(1)    
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

        // 4. 평문 비밀번호 일치 여부 비교
        if (!member.getUserPwd().equals(request.getUserPwd())) {
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

    // (기존 코드 하단에 추가) 이메일 정규화 헬퍼 메서드
    private String normalizeEmail(String email) {
        return (email != null) ? email.trim().toLowerCase() : null;
    }
	
}
