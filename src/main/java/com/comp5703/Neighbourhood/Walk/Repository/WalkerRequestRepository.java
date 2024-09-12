package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WalkerRequestRepository extends JpaRepository<WalkerRequest, Long> {
    Optional<WalkerRequest> findByRequestRequestIdAndWalkerUserId(int requestId, long walkerId);

    Optional<WalkerRequest> findByWalkerUserId(Long walkerId);

    @Override
    Optional<WalkerRequest> findById(Long walkerRequestId);
}
