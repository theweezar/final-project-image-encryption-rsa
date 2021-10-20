def write(file_name: str, input_data):
    input_file = open(file_name, "w+")
    input_file.write(input_data)
    input_file.close()

def read(file_name: str):
    output_string = ""
    status = 0
    try:
        output_file = open(file_name, "r")
        output_string = output_file.read()
        output_file.close()
    except:
        status = 1
    return output_string, status

def write_bin(file_name: str, input_data):
    input_file = open(file_name, "wb+")
    input_file.write(input_data)
    input_file.close()


def read_bin(file_name: str):
    output_bin = ""
    status = 0
    try:
        output_file = open(file_name, "rb")
        output_bin = output_file.read()
        output_file.close()
    except:
        status = 1
    return output_bin, status