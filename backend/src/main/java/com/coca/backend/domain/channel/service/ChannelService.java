package com.coca.backend.domain.channel.service;

import com.coca.backend.domain.channel.dto.ChannelCreateRequest;
import com.coca.backend.domain.channel.dto.ChannelCreateResponse;

public interface ChannelService {

	ChannelCreateResponse createChannel(ChannelCreateRequest request, String userId);

}
