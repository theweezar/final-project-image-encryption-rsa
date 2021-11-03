import time

def calculate_time_execute(callback):
    start_time = time.time()
    if callback is not None and type(callback).__name__ == "function":
        callback()
    else:
        raise TypeError("Callback is not function")
    print(f"\n--- {(time.time() - start_time)} seconds ---")