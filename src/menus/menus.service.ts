import { Injectable, NotFoundException } from '@nestjs/common';
import { MenusRepository } from '../domain/repositories/menus.repository';
import { Menu } from '../domain/entities/menu.entity';
import { IsNull } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { PagesRepository } from '../domain/repositories/pages.repository';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenusService {

  constructor(
    private readonly menusRepository: MenusRepository,
    private readonly pagesRepository: PagesRepository,
  ) { }

  async findAll({
    onlyParents = false,
    onlyActive
  }) {
    console.log({ onlyParents });
    let where = {};
    if (onlyActive) {
      where = {
        isActive: true
      };
    }
    if (onlyParents) {
      where = {
        ...where,
        parentId: IsNull()
      };
      const menus = await this.menusRepository.repository.find({
        select: ['id', 'titleEs', 'titleEn'],
        where,
        relations: ['page'] // Agregamos la relación page
      });
      return menus;
    }
    const menus = await this.menusRepository.repository.find({
      where,
      relations: ['page'] // Agregamos la relación page
    });
    const parents = menus.filter(menu => menu.parentId === null);
    return parents.map(parent => {
      const children = menus.filter(menu => menu.parentId === parent.id);
      return {
        ...parent,
        children
      };
    }).map(m => this.getWithI18n(m));
  }

  private getWithI18n(menu: Menu) {
    return {
      ...menu,
      i18n: {
        es: menu.titleEs,
        en: menu.titleEn
      },
      children: (menu.children?.length > 0) ? menu.children.map(child => this.getWithI18n(child)) : undefined
    }
  }

  async findOne(id: number, { onlyActive }) {
    console.log('searching for menu', id);
    let where: any = { 
      id,
    };
    if (onlyActive) {
      where = {
        ...where,
        isActive: true
      };
    }
    const menu = await this.menusRepository.repository.findOne({
      where,
      relations: ['page']
    });
    if (!menu) {
      throw new NotFoundException('Menu not found');
    }
    const children = await this.menusRepository.repository.find({
      where: { parentId: id }
    });
    menu.children = children;
    return menu;
  }

  async create(createMenuDto: CreateMenuDto) {
    const { pageId, parentId } = createMenuDto;
    const menu: Menu = {
      ...createMenuDto,
      //TODO: Implementar el usuario logueado
      createdUserId: 1,
      createdAt: new Date(),
    }
    if (pageId) {
      const page = await this.pagesRepository.repository.findOneOrFail({
        where: { id: pageId }
      });
      menu.page = page;
    }
    if (parentId) {
      const parent = await this.menusRepository.repository.findOneOrFail({
        where: { id: parentId }
      });
      menu.parent = parent;
    }
    const newMenu = await this.menusRepository.repository.save(menu);
    return newMenu;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const menu = await this.menusRepository.repository.findOneOrFail({
      where: { id }
    });
    const { pageId, parentId } = updateMenuDto;
    if (pageId && pageId !== menu.pageId) {
      const page = await this.pagesRepository.repository.findOneOrFail({
        where: { id: pageId }
      });
      menu.page = page;
    }
    if (parentId && parentId !== menu.parentId) {
      const parent = await this.menusRepository.repository.findOneOrFail({
        where: { id: parentId }
      });
      menu.parent = parent;
    }
    const updatedMenu = await this.menusRepository.repository.save({
      ...menu,
      ...updateMenuDto,
      updatedAt: new Date(),
      //TODO: Implementar el usuario logueado
      updatedUserId: 1
    });
    return updatedMenu;
  }

  async remove(id: number) {
    await this.menusRepository.repository.softDelete(id);
    return null;
  }
}