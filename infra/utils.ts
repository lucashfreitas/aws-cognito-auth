import * as ec2 from "@aws-cdk/aws-ec2";
import * as cdk from "@aws-cdk/core";

export function tagSubnets(
  subnets: ec2.ISubnet[],
  tagName: string,
  tagValue: string
) {
  for (const subnet of subnets) {
    cdk.Aspects.of(subnet).add(new cdk.Tag(tagName, tagValue));
  }
}
