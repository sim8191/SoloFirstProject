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

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {
	
	private final MemberService ms;
	@PostMapping("/sign-up")
    public ResponseEntity<MemberSignUpResponse> signUp(
    		@RequestBody
    		MemberSignUpRequest request) {
        MemberSignUpResponse response = ms.signUp(request);
        return ResponseEntity.ok(response);
    }

    // 로그인 엔드포인트: POST /api/member/sign-in
	@PostMapping("/sign-in")
    public ResponseEntity<MemberSignInResponse> signIn(
            @Valid @RequestBody MemberSignInRequest request,
            HttpServletResponse httpResponse) {

        MemberSignInResponse response = ms.signIn(request);

        // 추후 토큰 발급 로직 연동 위치:
        // authTokenIssueService.issue(response.getUserNo(), httpResponse);

        return ResponseEntity.ok(response);
    }
}
