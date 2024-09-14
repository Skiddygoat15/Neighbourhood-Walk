package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WalkerRequestRepository extends JpaRepository<WalkerRequest, Long> {
    Optional<WalkerRequest> findByRequestRequestIdAndWalkerUserId(int requestId, long walkerId);
    List<WalkerRequest> findByWalkerUserId(Long walkerId);

    @Query("SELECT wr.walker FROM WalkerRequest wr WHERE wr.request.requestId = :requestId")
    List<Users> findWalkersByRequestId(@Param("requestId") int requestId);

    @Query("SELECT wr.request FROM WalkerRequest wr WHERE wr.walker.id = :walkerId")
    List<Request> findRequestsByWalkerId(@Param("walkerId") long walkerId);

    @Override
    Optional<WalkerRequest> findById(Long walkerRequestId);

    WalkerRequest findByRequestRequestId(int requestId);
}
