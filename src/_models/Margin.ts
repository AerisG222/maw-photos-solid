import { DensityIdType, getDensityStage } from "./Density";

/*
   Which width the content runs at, as a class name.

   This file used to carry a four-step margin control of its own - an id type, a
   list, a default, a cycler and a lookup from id to `mx-[N%]`. The density
   absorbed all of that, and what is left is the one mapping the layout needs:
   a density in, the `.stage-*` class that caps the content width out.
*/
export const getStageClass = (density: DensityIdType) => `stage ${getDensityStage(density)}`;
