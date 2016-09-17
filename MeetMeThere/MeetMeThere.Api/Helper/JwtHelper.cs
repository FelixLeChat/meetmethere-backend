using System;
using System.Collections.Generic;

using MeetMeThere.Api.Models;

namespace MeetMeThere.Api.Helper
{
    public class JwtHelper
    {
        private const string SecretKey = "GQDstcKsx0NHjPOuXOYg5MbeJ1XT0uFiwDVvVBrk";

        public static bool ValidateToken(string token)
        {
            try
            {
                if (token == null)
                    return false;

                var jsonPayload = JWT.JsonWebToken.DecodeToObject(token, SecretKey) as IDictionary<string, object>;

                if (jsonPayload == null)
                    return false;

                var canadaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.Now.ToUniversalTime(),
                    TimeZoneInfo.FindSystemTimeZoneById("Atlantic Standard Time"));

                var expiration = (DateTime)jsonPayload["Expiration"];

                // Expired
                if (expiration < canadaTime)
                    return false;
            }
            catch (JWT.SignatureVerificationException)
            {
                return false;
            }
            return true;
        }

        public static string EncodeToken(UserToken token)
        {
            // Canada time + 1 hour
            var canadaExpirationTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.Now.ToUniversalTime().AddHours(1),
                TimeZoneInfo.FindSystemTimeZoneById("Atlantic Standard Time"));

            var payload = new Dictionary<string, object>()
            {
                { "username", token.Username },
                { "userId", token.UserId },
                { "Expiration", canadaExpirationTime }
            };
            return JWT.JsonWebToken.Encode(payload, SecretKey, JWT.JwtHashAlgorithm.HS256);
        }

        public static UserToken DecodeToken(string token)
        {
            if (ValidateToken(token))
            {
                var userToken = new UserToken() { Token = token };
                var jsonPayload = JWT.JsonWebToken.DecodeToObject(token, SecretKey) as IDictionary<string, object>;

                if (jsonPayload == null) return userToken;

                if (jsonPayload.ContainsKey("username"))
                    userToken.Username = (string)jsonPayload["username"];
                if (jsonPayload.ContainsKey("userId"))
                    userToken.UserId = (string)jsonPayload["userId"];
                if (jsonPayload.ContainsKey("Expiration"))
                    userToken.ExpirationDate = (DateTime)jsonPayload["Expiration"];

                return userToken;
            }
            return null;
        }
    }
}