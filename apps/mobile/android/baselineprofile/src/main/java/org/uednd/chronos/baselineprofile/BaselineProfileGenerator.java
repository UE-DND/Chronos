package org.uednd.chronos.baselineprofile;

import static org.junit.Assert.assertTrue;

import androidx.benchmark.macro.junit4.BaselineProfileRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.Until;
import java.util.regex.Pattern;
import kotlin.Unit;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
public class BaselineProfileGenerator {
    @Rule
    public BaselineProfileRule baselineProfileRule = new BaselineProfileRule();

    @Test
    public void coldStartup() {
        baselineProfileRule.collect("org.uednd.chronos", 15, 3, null, true, scope -> {
            scope.pressHome();
            scope.startActivityAndWait();
            // Wait beyond the native splash until actual app UI appears. A WebView alone
            // can be a blank/loading/error page and must not count as a successful startup.
            assertTrue("Chronos did not finish booting", scope.getDevice().wait(
                Until.hasObject(By.text(Pattern.compile("欢迎使用 Chronos|Welcome to Chronos|课表|Timetable"))), 30_000
            ));
            return Unit.INSTANCE;
        });
    }
}
