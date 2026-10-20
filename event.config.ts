import { fromBusiness, type BusinessInput } from "@/events/from-business";
import active from "@/events/active.json";
export const event = fromBusiness(active as unknown as BusinessInput);
export default event;
