from imgaug import augmenters as iaa
import imageio
import random
import numpy as np
import cv2
import glob
import os
from PIL import Image
import imgaug as ia
import imgaug.parameters as iap

path = "/Users/kvn/Documents/backyard/behi/static/textures/ss/"
images = os.listdir(path)

aug_affine_gaussian = iaa.Sequential([
    iaa.Affine(translate_px={"x": -40}),
    iaa.AdditiveGaussianNoise(scale=0.1*255)
], random_order=True)

aug_affine_gaussian_add_sharpen = iaa.SomeOf(3, [
    iaa.Affine(rotate=45),
    iaa.AdditiveGaussianNoise(scale=0.4*255),
    iaa.Add(50, per_channel=True),
    iaa.Sharpen(alpha=0.5)
])

aug_rotate = iaa.WithChannels(0, iaa.Affine(rotate=(0, 45)))

aug_poisson = iaa.AdditivePoissonNoise(100)

aug_cutout = iaa.Cutout(fill_mode="gaussian", fill_per_channel=True)
aug_dropout = iaa.Dropout(p=(0, 0.4), per_channel=0.5)
aug_coarse_dropout = iaa.CoarseDropout((0.05, 0.3), size_percent=(0.02, 0.25))
aug_salt_pepper = iaa.CoarseSaltAndPepper(0.09, size_percent=(0.02, 0.15))

aug_list = [aug_affine_gaussian, aug_affine_gaussian_add_sharpen, aug_rotate,
            aug_poisson, aug_cutout, aug_dropout, aug_coarse_dropout, aug_salt_pepper]

for i in images:
    filename, file_extension = os.path.splitext(i)
    # print(filename)
    if (file_extension == ".jpg") or (file_extension == ".png"):
        # let's roll the dice
        dice = random.randint(0, len(aug_list)-1)
        image = Image.open(path + filename+file_extension)

        w, h = image.size
        # print(image.size)
        output_size = 600
        bin_size = w // output_size
        img = np.array(image, dtype='uint8')
        img_shaped = img[:, :, 0:3]
        resized_image = cv2.resize(img_shaped, dsize=(int(w / bin_size),
                                                      int(h / bin_size)),)
        aug = random.choice(aug_list)

        images_aug = [aug(image=resized_image)]
        ia.imshow(ia.draw_grid(images_aug))
        imageio.imwrite(path + filename+file_extension, images_aug[0])
