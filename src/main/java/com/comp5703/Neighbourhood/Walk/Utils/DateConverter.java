package com.comp5703.Neighbourhood.Walk.Utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateConverter {
    public static Date StringToDate(String stringTypeUTCDate) {
        String cleanedDateStr = removeDaySuffix(stringTypeUTCDate);

        SimpleDateFormat formatter = new SimpleDateFormat("EEEE, MMMM dd, yyyy, hh:mm:ss a");
        try {
            Date date = formatter.parse(cleanedDateStr);
            return date;
        } catch (ParseException e) {
            System.err.println("Invalid date format");
            return null;
        }
    }

    public static String removeDaySuffix(String dateStr) {
        return dateStr.replaceAll("(\\d+)(st|nd|rd|th)", "$1");
    }
}