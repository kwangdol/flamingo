package org.exem.flamingo.shared.util;

import java.lang.management.ManagementFactory;

public class SystemUtils {

    public static final long MEGA_BYTES = 1024 * 1024;

    public static String getPid() {
        try {
            String name = ManagementFactory.getRuntimeMXBean().getName();
            if (name != null) {
                return name.split("@")[0];
            }
        } catch (Throwable ex) {
            // Ignore
        }
        return "????";
    }
}