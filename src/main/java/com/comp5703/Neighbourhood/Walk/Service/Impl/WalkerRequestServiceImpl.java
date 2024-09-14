package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Repository.WalkerRequestRepository;
import com.comp5703.Neighbourhood.Walk.Service.WalkerRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class WalkerRequestServiceImpl implements WalkerRequestService {

    @Autowired
    private WalkerRequestRepository walkerRequestRepository;

    /**
     * 根据walkerId获取walkerRequestId
     * @param walkerId
     * @return
     */
    @Override
    public List<WalkerRequest> getWalkerRequestByWalkerId(long walkerId) {
        List<WalkerRequest> walkerRequestList = walkerRequestRepository.findByWalkerUserId(walkerId);
        if (walkerRequestList != null) {
            return walkerRequestList;
        }
        return null;
    }

    /**
     * 根据walkerRequestId获取Request
     * @param walkerRequestId
     * @return
     */
    @Override
    public Request getRequest(long walkerRequestId) {
        return  walkerRequestRepository.findById(walkerRequestId).get().getRequest();
    }

//    /**
//     * 根据parentId和walkerId获取Request
//     */
//    @Override
//    public Request getRequestByWalkerIdAndParentId(long walkerRequestId) {
//        return  walkerRequestRepository.findById(walkerRequestId).get().getRequest();
//    }
    @Override
    public List<Users> getWalkersByRequestId(int requestId) {
        return walkerRequestRepository.findWalkersByRequestId(requestId);
    }

    @Override
    public List<Request> getRequestsByWalkerId(long walkerId) {
        return walkerRequestRepository.findRequestsByWalkerId(walkerId);
    }
}
