const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter');
const { propagation } = require('@opentelemetry/api');
const { W3CTraceContextPropagator } = require('@opentelemetry/core');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-node');
const { defaultResource, resourceFromAttributes, Resource } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } = require('@opentelemetry/semantic-conventions');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const {
  ParentBasedSampler,
  TraceIdRatioBasedSampler,
} = require('@opentelemetry/sdk-trace-base');

const isTracingEnabled = process.env.OTEL_ENABLED === 'true';

if (isTracingEnabled) {

  if (process.env.OTEL_LOG_LEVEL === 'debug') {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
  }

  propagation.setGlobalPropagator(new W3CTraceContextPropagator());

  const exporter = new TraceExporter({
    projectId: process.env.GCP_PROJECT_ID ?? undefined,
  });

  const samplingRatio = process.env.NODE_ENV === 'production'
    ? parseFloat(process.env.OTEL_SAMPLING_RATIO || '0.1')
    : 1.0;

  const sdk = new opentelemetry.NodeSDK({
    // resource: defaultResource().merge(
    //   resourceFromAttributes({
    //     [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'saev-backend',
    //     [ATTR_SERVICE_VERSION]: process.env.npm_package_version || '0.0.0',
    //   })
    // ),

    resource: new Resource({
      [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'saev-frontend',
      [ATTR_SERVICE_VERSION]: process.env.npm_package_version || '0.0.0',
    }),

    spanProcessor: new BatchSpanProcessor(exporter, {
      maxQueueSize: 2048,
      maxExportBatchSize: 512,
      scheduledDelayMillis: 5000,
      exportTimeoutMillis: 30000,
    }),

    sampler: new ParentBasedSampler({
      root: new TraceIdRatioBasedSampler(samplingRatio),
    }),

    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
        '@opentelemetry/instrumentation-net': { enabled: false },
        '@opentelemetry/instrumentation-dns': { enabled: false },
      }),
    ],
  });

  const shutdown = () =>
    sdk.shutdown()
      .then(() => console.log("OpenTelemetry SDK finalizado"))
      .catch((error) => console.log("Erro ao finalizar OpenTelemetry SDK", error))
      .finally(() => process.exit(0));

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  try {
    sdk.start();
    console.log("OpenTelemetry inicializado com GCP Trace Exporter");
  } catch (err) {
    console.error('OpenTelemetry falhou:', err);
  }
} else {
  console.log("OpenTelemetry desabilitado via variável de ambiente (OTEL_ENABLED).");
}