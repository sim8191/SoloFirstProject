package com.coca.backend.domain.channel.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ChannelCreateResponse {

	private Long channelNo;
    private String channelName;
    private Long userNo;

}
