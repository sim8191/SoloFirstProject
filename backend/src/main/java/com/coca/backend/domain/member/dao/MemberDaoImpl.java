package com.coca.backend.domain.member.dao;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.coca.backend.domain.member.vo.Member;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
@RequiredArgsConstructor
public class MemberDaoImpl implements MemberDao{
	
	private final SqlSessionTemplate session;
	
	@Override
	public int selectCountByUserId(String userId) {
		// TODO Auto-generated method stub
		return session.selectOne("member.selectCountByUserId", userId);
	}

	@Override
	public int selectCountByEmail(String email) {
		// TODO Auto-generated method stub
		return session.selectOne("member.selectCountByEmail", email);
	}

	@Override
	public void insertMember(Member member) {
		// TODO Auto-generated method stub
		session.insert("member.insertMember", member);
		
	}

	@Override
	public Member selectByUserId(String userId) {
		// TODO Auto-generated method stub
		return session.selectOne("member.selectByUserId", userId);		
	}
	
}
