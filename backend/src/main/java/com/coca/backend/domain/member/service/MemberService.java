package com.coca.backend.domain.member.service;

import java.lang.reflect.Member;

import com.coca.backend.domain.member.dto.MemberSignInRequest;
import com.coca.backend.domain.member.dto.MemberSignInResponse;
import com.coca.backend.domain.member.dto.MemberSignUpRequest;
import com.coca.backend.domain.member.dto.MemberSignUpResponse;

public interface MemberService {
	// 회원가입 비즈니스 로직
    MemberSignUpResponse signUp(MemberSignUpRequest request);

    // 로그인 비즈니스 로직 (성공 시 유저 정보 VO 반환)
    MemberSignInResponse signIn(MemberSignInRequest request);
}
