package com.coca.backend.domain.member.dao;

import com.coca.backend.domain.member.vo.Member;

public interface MemberDao {

	int selectCountByUserId(String userId);

	int selectCountByEmail(String email);

	void insertMember(Member member);

	Member selectByUserId(String userId);

}
