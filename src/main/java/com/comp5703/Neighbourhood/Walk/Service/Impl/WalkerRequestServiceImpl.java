package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Repository.RequestRepository;
import com.comp5703.Neighbourhood.Walk.Repository.WalkerRequestRepository;
import com.comp5703.Neighbourhood.Walk.Service.WalkerRequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Service
public class WalkerRequestServiceImpl implements WalkerRequestService {

    @Autowired
    private WalkerRequestRepository walkerRequestRepository;
    @Autowired
    private RequestRepository requestRepository;


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
        // 1. 首先检查该请求是否已经有被接受的 Walker
        Users acceptedWalker = walkerRequestRepository.findAcceptedWalkerByRequestId(requestId);
        // System.out.println("acceptedWalker: "+acceptedWalker);
        // 2. 如果有被接受的 Walker，返回该 Walker 的信息
        if (acceptedWalker != null) {
            return Collections.singletonList(acceptedWalker); // 返回只有该 Walker 的列表
        }

        // 3. 如果没有被接受的 Walker，返回所有候选的 Walkers
        return walkerRequestRepository.findWalkersByRequestId(requestId);
    }

    // todo: 只显示applied和accepted的
    @Override
    public List<Request> getRequestsByWalkerId(long walkerId) {
        return walkerRequestRepository.findRequestsByWalkerId(walkerId);
    }

    @Override
    public Optional<?> getRequestDetailByRequestIdAndWalkerId(int requestId, long walkerId) {
        // 首先根据 Email 查找用户
        Optional<WalkerRequest> walkerRequestOptional = walkerRequestRepository.findByRequestRequestIdAndWalkerUserId(requestId, walkerId);
        if (walkerRequestOptional.isEmpty()) {
            Optional<Request> requestOptional = requestRepository.findById(requestId);
            if (requestOptional.isPresent()) {
                return requestOptional;
            } else {
                throw new IllegalArgumentException("Request not found with id: " + requestId);
            }
        }
        return walkerRequestOptional;
    }

    public Users getParentIdByWalkerRequestId(long walkerRequestId) {
        Users parent = walkerRequestRepository.getById(walkerRequestId).getRequest().getParent();
        return parent;
    }

    public List<WalkerRequest> getWalkerRequestByRequestId(int requestId){
        return walkerRequestRepository.getByRequestRequestId(requestId);
    }
}
