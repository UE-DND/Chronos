package org.uednd.chronos;

import android.app.job.JobParameters;
import android.app.job.JobService;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;

public class ChronosUpdateJob extends JobService {
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private Future<?> worker;
    private AtomicBoolean stopped;
    @Override public boolean onStartJob(JobParameters params) {
        AtomicBoolean stoppedForJob = new AtomicBoolean(false); stopped = stoppedForJob;
        worker = executor.submit(() -> {
            try { ChronosUpdateManager.get(this).process(params.getExtras().getString("taskId")); }
            finally {
                ChronosUpdaterPlugin.changed();
                if (!stoppedForJob.get()) jobFinished(params, false);
            }
        });
        return true;
    }
    @Override public boolean onStopJob(JobParameters params) {
        if (stopped != null) stopped.set(true);
        if (worker != null) worker.cancel(true);
        return true;
    }
    @Override public void onDestroy() { executor.shutdownNow(); super.onDestroy(); }
}
