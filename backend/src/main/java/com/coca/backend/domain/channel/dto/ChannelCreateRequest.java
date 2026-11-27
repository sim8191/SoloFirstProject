package com.coca.backend.domain.channel.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChannelCreateRequest {

	private String channelName;
	private String channelDescription;
	private List<BoardCategoryRequest> categories;
	
	
}
