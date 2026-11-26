package com.coca.backend.domain.member.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coca.backend.domain.member.dto.MemberSignInRequest;
import com.coca.backend.domain.member.dto.MemberSignInResponse;
import com.coca.backend.domain.member.dto.MemberSignUpRequest;
import com.coca.backend.domain.member.dto.MemberSignUpResponse;
import com.coca.backend.domain.member.service.MemberService;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.util.List;

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

}
