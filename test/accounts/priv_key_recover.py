# order of base point G of secp256k1
n = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141

# modular multiplicative inverse (requires that n is prime)
def modinv(x, n=n):
    return pow(x, n-2, n)

# the two k candidates which aren't just negations of themselves
def k_candidates(s1, z1, s2, z2, n=n):
    z1_z2 = z1 - z2
    yield z1_z2 * modinv(s1 - s2, n) % n
    yield z1_z2 * modinv(s1 + s2, n) % n

# generates two tuples, each with (privkey, k_possibility_1, k_possibility_2)
def privkey_k_candidates(r, s1, z1, s2, z2, n=n):
    modinv_r = modinv(r, n)
    for k in k_candidates(s1, z1, s2, z2, n):
        yield (s1 * k - z1) * modinv_r % n,  k,  -k % n


r  = 0x69a726edfb4b802cbf267d5fd1dabcea39d3d7b4bf62b9eeaeba387606167166
s1 = 0x7724cedeb923f374bef4e05c97426a918123cc4fec7b07903839f12517e1b3c8 
z1 = 0x350f3ee8007d817fbd7349c477507f923c4682b3e69bd1df5fbb93b39beb1e04 
s2 = 0x2bbd9c2a6285c2b43e728b17bda36a81653dd5f4612a2e0aefdb48043c5108de 
z2 = 0x4f6a8370a435a27724bbc163419042d71b6dcbeb61c060cc6816cda93f57860c 

try:
    from pycoin.ecdsa import possible_public_pairs_for_signature, generator_secp256k1, public_pair_for_secret_exponent
    pubkeys = possible_public_pairs_for_signature(generator_secp256k1, z1, (r, s1))
    for privkey, k1, k2 in privkey_k_candidates(r, s1, z1, s2, z2):
        if public_pair_for_secret_exponent(generator_secp256k1, privkey) in pubkeys:
            print('k       = {:x}'.format(k1))
            print('or k    = {:x}'.format(k2))
            print('privkey = {:x}'.format(privkey))
            break
    else:
        print('privkey not found')

except ImportError:
    for privkey, k1, k2 in privkey_k_candidates(r, s1, z1, s2, z2):
        print('possible k       = {:x}'  .format(k1))
        print('possible k       = {:x}'  .format(k2))
        print('possible privkey = {:x}\n'.format(privkey))