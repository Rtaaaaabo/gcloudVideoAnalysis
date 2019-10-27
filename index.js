"use strict";
async function main() {
  const videoIntelligence = require("@google-cloud/video-intelligence");

  // Creates a client
  const client = new videoIntelligence.VideoIntelligenceServiceClient();
  const gcsUri = "gs://test-pay-per-laugh/test_movie.MOV";

  // Construct request
  const request = {
    inputUri: gcsUri,
    features: ["LABEL_DETECTION"]
  };
  const [operation] = await client.annotateVideo(request);

  console.log(
    "Waiting for operation to complete... (this may take a few minutes)"
  );

  const [operationResult] = await operation.promise();
  const annotations = operationResult.annotationResults[0];
  const labels = annotations.segmentLabelAnnotations;
  labels.forEach(label => {
    console.log(`Label ${label.entity.description} occurs at:`);
    label.segments.forEach(segment => {
      segment = segment.segment;
      if (segment.startTimeOffset.seconds === undefined) {
        segment.startTimeOffset.seconds = 0;
      }
      if (segment.startTimeOffset.nanos === undefined) {
        segment.startTimeOffset.nanos = 0;
      }
      if (segment.endTimeOffset.seconds === undefined) {
        segment.endTimeOffset.seconds = 0;
      }
      if (segment.endTimeOffset.nanos === undefined) {
        segment.endTimeOffset.nanos = 0;
      }
      console.log(
        `\tStart: ${segment.startTimeOffset.seconds}` +
          `.${(segment.startTimeOffset.nanos / 1e6).toFixed(0)}s`
      );
      console.log(
        `\tEnd: ${segment.endTimeOffset.seconds}.` +
          `${(segment.endTimeOffset.nanos / 1e6).toFixed(0)}s`
      );
    });
  });
}

main().catch(console.error);
