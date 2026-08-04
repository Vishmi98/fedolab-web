import { ServiceType } from "../home.types";

const ServiceCard = ({ icon: Icon, title, paragraph }: ServiceType) => {
    return (
        <div className="group rounded-3xl bg-white p-8 transition-all duration-300 space-y-4 h-[280px]">
            {/* Icon */}
            <Icon className="text-5xl" />

            {/* Title */}
            <h3 className="mb-2 text-2xl font-bold">
                {title}
            </h3>

            {/* Description */}
            <p>
                {paragraph}
            </p>
        </div>
    );
};

export default ServiceCard;
