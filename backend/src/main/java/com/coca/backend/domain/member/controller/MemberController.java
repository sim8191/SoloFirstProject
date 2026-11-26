package com.coca.backend.domain.member.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coca.backend.domain.member.dto.MemberSignInRequest;
import com.coca.backend.domain.member.dto.MemberSignInResponse;
import com.coca.backend.domain.member.dto.MemberSignUpRequest;
import com.coca.backend.domain.member.dto.MemberSignUpResponse;
import com.coca.backend.domain.member.service.MemberService;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {
	
	private final MemberService ms;
	// Spring Security 인증 정보를 세션에 저장하는 객체
	private final SecurityContextRepository securityContextRepository;
	
	@PostMapping("/sign-up")
    public ResponseEntity<MemberSignUpResponse> signUp(
    		@RequestBody
    		MemberSignUpRequest request) {
        MemberSignUpResponse response = ms.signUp(request);
        return ResponseEntity.ok(response);
    }


	/**
	 * 회원 로그인 및 세션 인증 정보 저장.
	 */
	@PostMapping("/sign-in")
	public ResponseEntity<MemberSignInResponse> signIn(
	        @Valid @RequestBody MemberSignInRequest request,
	        HttpServletRequest httpRequest,
	        HttpServletResponse httpResponse) {
	
	    // 1. 기존 Service에서 회원 조회 및 비밀번호 검증
	    MemberSignInResponse response = ms.signIn(request);
	
	    // 2. DB의 권한 번호를 Spring Security 권한으로 변환
	    String role = switch (response.getAuthority()) {
	        case 1 -> "ROLE_ADMIN";
	        case 2 -> "ROLE_VERIFIED";
	        case 3 -> "ROLE_USER";
	        default -> throw new IllegalStateException(
	                "등록되지 않은 회원 권한입니다.");
	    };
	
	    // 3. 검증 완료된 회원의 인증 객체 생성
	    var authentication = UsernamePasswordAuthenticationToken.authenticated(
	            response.getUserId(),
	            null,
	            List.of(new SimpleGrantedAuthority(role))
	    );
	
	    // 4. Spring Security 인증 정보 생성
	    SecurityContext context = SecurityContextHolder.createEmptyContext();
	    context.setAuthentication(authentication);
	
	    // 5. 기존 세션이 있다면 세션 ID 변경
	    if (httpRequest.getSession(false) != null) {
	        httpRequest.changeSessionId();
	    }
	
	    // 6. 현재 요청에 인증 정보 등록
	    SecurityContextHolder.setContext(context);
	
	    // 7. 인증 정보를 HTTP 세션에 저장
	    securityContextRepository.saveContext(
	            context,
	            httpRequest,
	            httpResponse
	    );
	
	    // 8. 로그인한 회원정보 반환
	    return ResponseEntity.ok(response);
	}
	
	@GetMapping("/me")
	public ResponseEntity<MemberSignInResponse> getMyInfo(
			 Authentication authentication
			) {
		// 1. 세션에 저장된 로그인 아이디 확인
	    String userId = authentication.getName();

	    // 2. Service를 통해 현재 회원정보 조회
	    MemberSignInResponse response = ms.getMyInfo(userId);

	    // 3. 조회한 회원정보 반환
	    return ResponseEntity.ok(response);
	}
	
	// 현재 로그인한 회원의 세션을 종료한다.
	@PostMapping("/sign-out")
	public ResponseEntity<Void> signOut(
	        HttpServletRequest request,
	        HttpServletResponse response) {

	    // 1. 현재 사용자의 인증 정보 가져오기
	    Authentication authentication =
	            SecurityContextHolder.getContext().getAuthentication();

	    // 2. Spring Security 로그아웃 처리
	    new SecurityContextLogoutHandler().logout(
	            request,
	            response,
	            authentication
	    );

	    // 3. 로그아웃 성공 응답 반환
	    return ResponseEntity.noContent().build();
	}
	
	// 현재 세션의 CSRF 토큰을 반환한다.
	@GetMapping("/csrf")
	public ResponseEntity<Map<String, String>> getCsrfToken(
	        @RequestAttribute("_csrf") CsrfToken csrfToken) {

	    return ResponseEntity.ok(
	            Map.of("token", csrfToken.getToken())
	    );
	}

}
