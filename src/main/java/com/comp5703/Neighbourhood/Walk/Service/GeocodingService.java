package com.comp5703.Neighbourhood.Walk.Service;

import java.util.Map;

public interface GeocodingService {
    Map<String, Object> getGeocode(String address) throws Exception;
}
