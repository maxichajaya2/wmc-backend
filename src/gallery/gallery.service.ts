import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentFilters } from '../domain/repositories/blocks.repository';
import { GalleriesRepository } from '../domain/repositories/gallery.repository';
// import { GalleryImagesRepository } from '../domain/repositories/gallery-image.repository';
import { In } from 'typeorm';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { Gallery, GalleryImage, GalleryType } from '../domain/entities/gallery.entity';
import { GalleryImagesRepository } from '../domain/repositories/gallery-image.repository';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import axios from 'axios';

@Injectable()
export class GalleryService {

  constructor(
    private readonly galleriesRepository: GalleriesRepository,
    private readonly galleryImagesRepository: GalleryImagesRepository,
  ) { }

  async findAll(query: ContentFilters) {
    const { keys, onlyActive } = query;
    let where = {};
    if (onlyActive === 'true') {
      where = {
        isActive: true
      };
    }
    if (keys) {
      const keysArray = keys.split(',');
      where = {
        urlKey: In(keysArray)
      };
    }
    const galleries = await this.galleriesRepository.repository.find({
      where,
      relations: ['images'],
    });
    return galleries.map(g => {
      const images = g.images.sort((a, b) => a.sort - b.sort);
      return {
        ...g,
        images,
      };
    });
  }

  async findOne(id: number, { onlyActive } = { onlyActive: false }) {
    const where = { id };
    if (onlyActive) {
      where['isActive'] = true;
    }
    const gallery = await this.galleriesRepository.repository.findOne({
      where,
      relations: ['images'],
    });
    if (!gallery) {
      throw new NotFoundException('Gallery not found');
    }
    return gallery;
  }

  async create(createGalleryDto: CreateGalleryDto) {
    console.log('createGalleryDto', createGalleryDto);
    const { images, startDate, endDate, ...rest } = createGalleryDto;
    const gallery: Gallery = {
      ...rest,
      createdAt: new Date(),
    }
    if (gallery.type === GalleryType.BANNER && startDate && endDate) {
      console.log({ startDate, endDate });
      gallery.startDate = new Date(startDate);
      gallery.endDate = new Date(endDate);
    }
    const newGallery = await this.galleriesRepository.repository.save(gallery);
    for (const imageDto of images) {
      //const fileSize = await this.getDownloadedImageSize(imageDto.value);
      const galleryImage: GalleryImage = {
        ...imageDto,
        //fileSize,
        galleryId: newGallery.id,
        gallery: newGallery,
        createdAt: new Date(),
      }
      await this.galleryImagesRepository.repository.save(galleryImage);
    }
    const createdGallery = await this.findOne(newGallery.id);
    return createdGallery;
  }

  async getDownloadedImageSize(url: string) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return Buffer.byteLength(response.data);
    } catch (error) {
      console.error('Error descargando la imagen:', error);
    }
  }

  async update(id: number, updateGalleryDto: UpdateGalleryDto) {
    console.log('updateGalleryDto', updateGalleryDto);
    const gallery = await this.findOne(id);
    const currentImages = gallery.images;
    console.log({ currentImages });
    const { images: _, ...galleryWithoutImages } = gallery;
    const { images, ...rest } = updateGalleryDto;
    const payload = {
      ...galleryWithoutImages,
      ...rest,
    };
    const deleteImages = currentImages.filter(image => !images.some(i => i.id === image.id));
    console.log({ deleteImages });
    for (const image of deleteImages) {
      await this.galleryImagesRepository.repository.softDelete(image.id);
    }
    for (const imageDto of images) {
      const { id, ...rest } = imageDto;
      if (id) {
        await this.galleryImagesRepository.repository.update(id, { ...rest, updatedAt: new Date() });
      } else {
        const galleryImage: GalleryImage = {
          ...rest,
          galleryId: gallery.id,
          gallery,
          createdAt: new Date(),
        }
        await this.galleryImagesRepository.repository.save(galleryImage);
      }
    }
    console.log({ payload });
    await this.galleriesRepository.repository.save(payload);
    const updatedGallery = await this.findOne(id);
    return updatedGallery;
  }

  async remove(id: number) {
    await this.galleriesRepository.repository.softDelete(id);
    return null;
  }
}
