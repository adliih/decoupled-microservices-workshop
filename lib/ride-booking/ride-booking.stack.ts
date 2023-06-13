import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { RideBookingService } from "./ride-booking.service";
import { RideBookingRfqProviderService } from "./ride-booking-rfq-provider.service";

export interface RideBookingStackProps {}

export class RideBookingStack extends Construct {
  constructor(scope: Construct, id: string, props: RideBookingStackProps) {
    super(scope, id);

    const rideBookingService = new RideBookingService(
      this,
      "RideBookingService",
      {}
    );

    new RideBookingRfqProviderService(this, "RfqProvider1", {
      fareMultiplier: 2,
      instantRideRfqTopic: rideBookingService.instantRideRfqTopic,
      rfqResponseQueue: rideBookingService.rfqResponseQueue,
    });

    new RideBookingRfqProviderService(this, "RfqProvider2", {
      fareMultiplier: 3,
      instantRideRfqTopic: rideBookingService.instantRideRfqTopic,
      rfqResponseQueue: rideBookingService.rfqResponseQueue,
    });

    new RideBookingRfqProviderService(this, "RfqProvider3", {
      fareMultiplier: 10,
      instantRideRfqTopic: rideBookingService.instantRideRfqTopic,
      rfqResponseQueue: rideBookingService.rfqResponseQueue,
    });
  }
}
