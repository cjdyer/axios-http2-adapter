"use strict";

export default (stream) => {
    if (stream.listenerCount("error") !== 0) {
        return stream;
    }

    stream.__destroy = stream._destroy;
    stream._destroy = (...args) => {
        const callback = args.pop();

        stream.__destroy(...args, async (error) => {
            await Promise.resolve();
            callback(error);
        });
    };

    const onError = (error) => {
        Promise.resolve().then(() => {
            stream.emit("error", error);
        });
    };

    stream.once("error", onError);

    Promise.resolve().then(() => {
        stream.off("error", onError);
    });

    return stream;
};
