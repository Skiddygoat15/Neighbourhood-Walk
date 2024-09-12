package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Repository.WalkerRequestRepository;
import com.comp5703.Neighbourhood.Walk.Service.WalkerRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class WalkerRequestServiceImpl implements WalkerRequestService {

    @Autowired
    private WalkerRequestRepository walkerRequestRepository;

    /**
     * 根据walkerId获取他的walkerRequestId
     * @param walkerId
     * @return
     */
    @Override
    public WalkerRequest getWalkerRequest(long walkerId) {
        Optional<WalkerRequest> walkerRequest = walkerRequestRepository.findByWalkerUserId(walkerId);
        WalkerRequest request = null;
        if (walkerRequest.isPresent()) {
            request = walkerRequest.get();
            // 使用 request 对象
        }
        return request;
    }

    /**
     * 根据walkerRequestId获取requestId
     * @param walkerRequestId
     * @return
     */
    @Override
    public int getRequest(long walkerRequestId) {
        return  walkerRequestRepository.findById(walkerRequestId).get().getRequest().getRequestId();
    }
}
