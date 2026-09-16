package com.coca.backend.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberSignUpResponse {
	private Long userNo;       // 생성된 회원 고유 식별 번호 (PK)
    private String userId;     // 가입한 아이디
    private String userName;   // 가입자 이름
}
