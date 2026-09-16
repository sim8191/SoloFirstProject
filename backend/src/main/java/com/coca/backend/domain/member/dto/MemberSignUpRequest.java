package com.coca.backend.domain.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MemberSignUpRequest {
	// 회원 가입
	private String userId;
    private String userPwd;
    private String passwordConfirm;
    private String userName;
    private String userEmail;
    private String userPhone;
}
