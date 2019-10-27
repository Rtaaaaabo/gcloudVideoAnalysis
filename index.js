const video = require("@google-cloud/video-intelligence").v1;
const client = new video.VideoIntelligenceServiceClient();

const gcsUrl = "gs://test-pay-per-laugh/test_movie.MOV";

const request = {
  inputUri: gcsUri,
  features: ["LABEL_DETECTION"]
};

const [operation] = await client.annotateVideo(request);
console.log("Waiting...");
const [operationResult] = await operation.promise();

// Annotation
const annotations = operationResult.annotationResults[0];

const labels = annotations.segmentLabelAnnotations;
labels.forEach(label => {
  console.log(`Label ${label.entity.description} occurs at:`);
  label.segments.forEach(segment => {
    const time = segment.segment;
    if (time.startTimeOffset.seconds === undefined) {
      time.startTimeOffset.seconds = 0;
    }
    if (time.startTimeOffset.nanos === undefined) {
      time.startTimeOffset.nanos = 0;
    }
    if (time.endTimeOffset.seconds === undefined) {
      time.endTimeOffset.seconds = 0;
    }
    if (time.endTimeOffset.nanos === undefined) {
      time.endTimeOffset.nanos = 0;
    }
    console.log(
      `\tStart: ${time.startTimeOffset.seconds}` +
        `.${(time.startTimeOffset.nanos / 1e6).toFixed(0)}s`
    );
    console.log(
      `\tEnd: ${time.endTimeOffset.seconds}.` +
        `${(time.endTimeOffset.nanos / 1e6).toFixed(0)}s`
    );
    console.log(`\tConfidence: ${segment.confidence}`);
  });
});
