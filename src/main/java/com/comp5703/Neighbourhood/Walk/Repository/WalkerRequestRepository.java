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

    // Query has been accepted Walker
    @Query("SELECT w.walker FROM WalkerRequest w WHERE w.request.requestId = :requestId AND w.status = 'Accepted' ")
    Users findAcceptedWalkerByRequestId(@Param("requestId") int requestId);

    // find all walker applied this request excluding the walker being rejected
    @Query("SELECT wr.walker FROM WalkerRequest wr WHERE wr.request.requestId = :requestId AND wr.status != 'Rejected'")
    List<Users> findWalkersByRequestId(@Param("requestId") int requestId);

    @Query("SELECT wr.request FROM WalkerRequest wr WHERE wr.walker.userId = :walkerId")
    List<Request> findRequestsByWalkerId(@Param("walkerId") long walkerId);

    @Override
    Optional<WalkerRequest> findById(Long walkerRequestId);

    WalkerRequest getByRequestRequestIdAndWalkerUserId(int requestId, long walkerId);

    List<WalkerRequest> getByRequestRequestId(int requestId);
}
