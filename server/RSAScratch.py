import base64
import FileHelpers
import SystemHelpers
from Crypto.Util import number
from Keypair import Keypair

# public_key = 166545539961254822273044515772174488280273924999499357126534558813374032667966322483242423850270581260099089487846242806895701849791660739292704504400279158325164490447653350310437422456812704751147871272454206003372304733850770935440979385663789650185404744254224436620457899190335959365340454730459059991039

# private_key = 8469012676568989392758110518202779458481857766417100305471290980681953191855801713179890160556657489602279401189844028475303624046645516107625236203197894482349126378077673495715931362345781872455947296142490805023063128848112794770188446084898727790251931082834157432387306581065270565491089050754997905872559934548263282249791883509737823853704049399577889261280030578254172348192396412887339833902253584883828971557184869746628349153148837743801815047500197802947167828425320322036323121915992967416345552938106230776315800861580329545940074546412560444506729678393785163214647914421132525050110760258018852904859

# modulus_n = 13456838159611498905171223928174718166768510228976349734115794058861489416447358714051628242868276559203026620430414490716826087288871018945776145385958763255432056215769641666723623777036877779708633332485047246146949307556635797261180257724664430169853566131578732457623904039926841468366096180328301668265023936540532648790543690098749820091988503712862011591453048668154775170564144373849683639265219056874440560509051688171804488335285482421918082594897878197762990250761563378704826199875665092318457221285726868427829447745254127410029924893842413113672580331846025013436896087800577587154960601464623579203897

def encrypt(data_bytes: bytes, keypair: Keypair):
    track = 0
    limit = 254
    stop = False
    enc_result = b""
    data_bytes_length = len(data_bytes)
    print("\nPlain bytes length:", data_bytes_length)

    while stop is False:
        block_bytes = data_bytes[track: track + limit] if track + limit < data_bytes_length else data_bytes[track: data_bytes_length]
        stop = False if track + limit < data_bytes_length else True
        track += limit
        block_long = number.bytes_to_long(block_bytes)
        if block_long < keypair.get_modulus_n_public():
            enc_long = pow(block_long, keypair.get_public_key_long(), keypair.get_modulus_n_public())
            enc_result += hex(enc_long).encode() + b";"
        else:
            raise ValueError("Message long integer is bigger than modulus")
        
    return enc_result[:-1]

def decrypt(data: bytes, keypair: Keypair):
    enc_blocks_long = data.split(b";")
    dec_result = b""
    print("\nDecrypt will loop:", len(enc_blocks_long))
    
    for block_long_str in enc_blocks_long:
        dec_long = pow(int(block_long_str, 16), keypair.get_private_key_long(), keypair.get_modulus_n_private())
        dec_result += number.long_to_bytes(dec_long)

    print("Decrypted to plain length:", len(dec_result))

    return dec_result

def encrypt_array_to_file(list_of_files_b64: list, keypair: Keypair):
    """Encrypt a list of file and return just 1 encrypted file"""
    encrypt_file_bytes_container = b""

    for file_b64 in list_of_files_b64:
        enc_file_b64 = encrypt(file_b64, keypair)
        encrypt_file_bytes_container += enc_file_b64 + b","

    return encrypt_file_bytes_container + b"encrypted"

def decrypt_to_file_array(encrypted_files_b64: bytes, keypair: Keypair):
    """Decrypt a file and return a list of plain files"""
    decrypt_file_bytes_container = []

    encrypted_array_files_b64 = encrypted_files_b64.split(b",")
    if encrypted_array_files_b64[-1] == b"encrypted":
        for file_b64 in encrypted_array_files_b64[:-1]:
            dec_file_b64 = decrypt(file_b64, keypair)
            decrypt_file_bytes_container.append(dec_file_b64)

    return decrypt_file_bytes_container

def main():
    keypair = Keypair()
    public_key_data, stt1 = FileHelpers.read("public_key.txt")
    private_key_data, stt2 = FileHelpers.read("private_key.txt")
    keypair.import_public_key(public_key_data)
    keypair.import_private_key(private_key_data)

    file_name1 = "blackping.jpg"
    file_name2 = "test.jpg"
    file_name3 = "my.jpg"

    image_file_bytes1, stt3 = FileHelpers.read_bin(f"images/{file_name1}")
    image_file_bytes2, stt3 = FileHelpers.read_bin(f"images/{file_name2}")
    image_file_bytes3, stt3 = FileHelpers.read_bin(f"images/{file_name3}")
    
    image_file_b64_1 = f"{file_name1}|".encode() + base64.b64encode(image_file_bytes1)
    image_file_b64_2 = f"{file_name2}|".encode() + base64.b64encode(image_file_bytes2)
    image_file_b64_3 = f"{file_name3}|".encode() + base64.b64encode(image_file_bytes3)

    # print("Compare 2 modulus:", keypair.get_modulus_n_private() == keypair.get_modulus_n_public())

    def execute():
        # enc = encrypt(
        #     image_file_b64,
        #     keypair
        # )
        enc = encrypt_array_to_file([image_file_b64_1, image_file_b64_2, image_file_b64_3], keypair)
        FileHelpers.write_bin("encrypted/encrypted.cry", enc)
        
        # enc, stt = FileHelpers.read_bin("encrypted/encrypted.cry")
        dec_arr = decrypt_to_file_array(enc, keypair)
        for dec in dec_arr:
            dec_file_info = bytes(dec).split(b"|")
            if len(dec_file_info) == 2:
                FileHelpers.write_bin(f"decrypted/{dec_file_info[0].decode()}", base64.b64decode(dec_file_info[1]))

        # print("\nDecrypted:", dec.decode() == image_file_b64.decode())
        
    SystemHelpers.calculate_time_execute(execute)


if __name__ == "__main__":
    main()
