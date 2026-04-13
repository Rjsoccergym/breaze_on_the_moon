package org.booking.com.infrastructure.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class FeignInterceptor implements RequestInterceptor {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String USER_HEADER = "X-Authenticated-User";
    private static final String ROLE_HEADER = "X-Authenticated-Role";
    private static final String USER_ID_HEADER = "X-Authenticated-User-Id";
    private static final String INTERNAL_SERVICE_HEADER = "X-Internal-Service";

    @Override
    public void apply(RequestTemplate template) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        template.header(INTERNAL_SERVICE_HEADER, "booking-service");

        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            propagateIfPresent(request, template, AUTHORIZATION_HEADER);
            propagateIfPresent(request, template, USER_HEADER);
            propagateIfPresent(request, template, ROLE_HEADER);
            propagateIfPresent(request, template, USER_ID_HEADER);
        }
    }

    private void propagateIfPresent(HttpServletRequest request, RequestTemplate template, String headerName) {
        String headerValue = request.getHeader(headerName);
        if (headerValue != null && !headerValue.isBlank()) {
            template.header(headerName, headerValue);
        }
    }
}
