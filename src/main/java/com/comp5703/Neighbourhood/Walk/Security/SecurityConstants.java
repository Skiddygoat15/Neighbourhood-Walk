package com.comp5703.Neighbourhood.Walk.Security;

public class SecurityConstants {
    public static final String SECRET_KEY = "bQeThWmZq4t7w!z$.lp)J@NcRfUj9K2r5m)x/A?D*G-KaPdSgVkYp3s6v9y$B&E)"; //Your secret should always be strong (uppercase, lowercase, numbers, symbols) so that nobody can potentially decode the signature.
    public static final int TOKEN_EXPIRATION = 3600000; // 3600000 milliseconds = 3600 seconds = 1 hours.
    public static final String BEARER = "Bearer "; // Authorization : "Bearer " + Token
    public static final String AUTHORIZATION = "Authorization"; // "Authorization" : Bearer Token
    public static final String REGISTER_PATH = "/Users/register"; // Public path that clients can use to register.
}
