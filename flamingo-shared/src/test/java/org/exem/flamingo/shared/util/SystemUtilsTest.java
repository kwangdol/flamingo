package org.exem.flamingo.shared.util;

import org.junit.Assert;
import org.junit.Test;

public class SystemUtilsTest {

    @Test
    public void getPid() {
        String pid = SystemUtils.getPid();
        Assert.assertNotEquals("????", pid);
    }
}
