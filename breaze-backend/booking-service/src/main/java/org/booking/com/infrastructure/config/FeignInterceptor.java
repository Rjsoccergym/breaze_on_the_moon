package org.booking.com.infrastructure.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class FeignInterceptor implements RequestInterceptor {

    private static final String INTERNAL_SERVICE_HEADER = "X-Internal-Service";
    private static final String INTERNAL_SECRET_HEADER = "X-Internal-Secret";

    @Value("${internal.shared-secret}")
    private String internalSharedSecret;

    @Override
    public void apply(RequestTemplate template) {
        template.header(INTERNAL_SERVICE_HEADER, "booking-service");
        template.header(INTERNAL_SECRET_HEADER, internalSharedSecret);
    }
}
