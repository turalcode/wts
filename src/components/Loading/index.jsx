import Skeleton from "../UI/Skeleton";

const Loading = () => {
    return (
        <div className="p-2">
            <div className="animate-pulse flex space-x-4">
                <div className="flex-1">
                    <div className="grid gap-2">
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loading;
