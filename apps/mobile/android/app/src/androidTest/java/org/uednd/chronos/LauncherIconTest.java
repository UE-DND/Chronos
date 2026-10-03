package org.uednd.chronos;

import static org.junit.Assert.*;
import static org.junit.Assume.assumeTrue;

import android.content.Context;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.drawable.AdaptiveIconDrawable;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.os.Build;
import androidx.test.platform.app.InstrumentationRegistry;
import org.junit.Test;

public class LauncherIconTest {
    private Context context(boolean night) {
        Context target = InstrumentationRegistry.getInstrumentation().getTargetContext();
        Configuration configuration = new Configuration(target.getResources().getConfiguration());
        configuration.uiMode = (configuration.uiMode & ~Configuration.UI_MODE_NIGHT_MASK)
            | (night ? Configuration.UI_MODE_NIGHT_YES : Configuration.UI_MODE_NIGHT_NO);
        return target.createConfigurationContext(configuration);
    }

    private Bitmap render(Drawable drawable) {
        Bitmap bitmap = Bitmap.createBitmap(108, 108, Bitmap.Config.ARGB_8888);
        drawable.setBounds(0, 0, 108, 108);
        drawable.draw(new Canvas(bitmap));
        return bitmap;
    }

    private void assertArtworkWithoutBackground(Drawable drawable) {
        assertNotNull(drawable);
        Bitmap bitmap = render(drawable);
        assertEquals(0, Color.alpha(bitmap.getPixel(0, 0)));
        assertEquals(0, Color.alpha(bitmap.getPixel(107, 107)));
        // The C opening stays empty, while the upper arc and clock hands stay visible.
        assertEquals(0, Color.alpha(bitmap.getPixel(70, 54)));
        assertEquals(255, Color.alpha(bitmap.getPixel(54, 29)));
        assertEquals(255, Color.alpha(bitmap.getPixel(54, 54)));
    }

    @Test public void backgroundFollowsSystemNightMode() {
        assumeTrue(Build.VERSION.SDK_INT >= 26);
        for (boolean night : new boolean[] { false, true }) {
            Context themed = context(night);
            int expected = night ? Color.rgb(24, 33, 43) : Color.WHITE;
            assertEquals(expected, themed.getColor(R.color.ic_launcher_background));
            for (int id : new int[] { R.mipmap.ic_launcher, R.mipmap.ic_launcher_round }) {
                Drawable icon = themed.getDrawable(id);
                assertTrue(icon instanceof AdaptiveIconDrawable);
                Drawable background = ((AdaptiveIconDrawable) icon).getBackground();
                assertTrue(background instanceof ColorDrawable);
                assertEquals(expected, ((ColorDrawable) background).getColor());
            }
        }
    }

    @Test public void adaptiveForegroundDoesNotCoverTheNightBackground() {
        assumeTrue(Build.VERSION.SDK_INT >= 26);
        for (boolean night : new boolean[] { false, true }) {
            Context themed = context(night);
            for (int id : new int[] { R.mipmap.ic_launcher, R.mipmap.ic_launcher_round }) {
                AdaptiveIconDrawable icon = (AdaptiveIconDrawable) themed.getDrawable(id);
                assertArtworkWithoutBackground(icon.getForeground());
            }
        }
    }

    @Test public void themedIconsExposeTheCAndClockSilhouette() {
        assumeTrue(Build.VERSION.SDK_INT >= 33);
        for (boolean night : new boolean[] { false, true }) {
            Context themed = context(night);
            for (int id : new int[] { R.mipmap.ic_launcher, R.mipmap.ic_launcher_round }) {
                AdaptiveIconDrawable icon = (AdaptiveIconDrawable) themed.getDrawable(id);
                assertArtworkWithoutBackground(icon.getMonochrome());
            }
        }
    }
}
