'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from './prisma';

export type ActionResult = {
  ok: boolean;
  message: string;
};

const ok = (message: string): ActionResult => ({ ok: true, message });
const fail = (message: string): ActionResult => ({ ok: false, message });

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function asString(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

function asNumber(value: FormDataEntryValue | null) {
  const parsed = Number(asString(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function createCategory(formData: FormData) {
  const name = asString(formData.get('name'));
  if (!name) return;

  const slug = slugify(asString(formData.get('slug')) || name);
  await prisma.category.create({
    data: {
      name,
      slug,
    },
  });
  revalidatePath('/admin/categorias');
}

export async function createCategoryAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await createCategory(formData);
    return ok('Categoría creada');
  } catch {
    return fail('No se pudo crear la categoría');
  }
}

export async function updateCategoryAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await updateCategory(formData);
    return ok('Categoría actualizada');
  } catch {
    return fail('No se pudo actualizar la categoría');
  }
}

export async function deleteCategoryAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await deleteCategory(formData);
    return ok('Categoría eliminada');
  } catch {
    return fail('No se pudo eliminar la categoría');
  }
}

export async function updateCategory(formData: FormData) {
  const id = Number(asString(formData.get('id')));
  const name = asString(formData.get('name'));
  if (!id || !name) return;

  const slug = slugify(asString(formData.get('slug')) || name);
  await prisma.category.update({
    where: { id },
    data: { name, slug },
  });
  revalidatePath('/admin/categorias');
}

export async function deleteCategory(formData: FormData) {
  const id = Number(asString(formData.get('id')));
  if (!id) return;
  await prisma.category.delete({ where: { id } });
  revalidatePath('/admin/categorias');
}

export async function createProduct(formData: FormData) {
  const sku = asString(formData.get('sku'));
  const descripcion = asString(formData.get('descripcion'));
  if (!sku || !descripcion) {
    throw new Error('SKU y descripción corta son requeridos.');
  }
  const referencia = asString(formData.get('referencia'));
  const manualSlug = asString(formData.get('slug'));
  const slugSource = manualSlug || descripcion;

  await prisma.product.create({
    data: {
      sku,
      descripcion,
      referencia,
      slug: slugify(slugSource),
      imageUrl: asString(formData.get('imageUrl')),
      textoDescripcion: asString(formData.get('textoDescripcion')),
      categoryId: asNumber(formData.get('categoryId')) || null,
    },
  });
  revalidatePath('/admin/productos');
}

export async function createProductAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await createProduct(formData);
    return ok('Producto creado');
  } catch {
    return fail('No se pudo crear el producto');
  }
}

export async function updateProductAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await updateProduct(formData);
    return ok('Producto actualizado');
  } catch {
    return fail('No se pudo actualizar el producto');
  }
}

export async function deleteProductAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await deleteProduct(formData);
    return ok('Producto eliminado');
  } catch {
    return fail('No se pudo eliminar el producto');
  }
}

export async function updateProduct(formData: FormData) {
  const id = Number(asString(formData.get('id')));
  const sku = asString(formData.get('sku'));
  const descripcion = asString(formData.get('descripcion'));
  if (!id || !sku || !descripcion) {
    throw new Error('SKU y descripción corta son requeridos.');
  }
  const referencia = asString(formData.get('referencia'));
  const manualSlug = asString(formData.get('slug'));
  const slugSource = manualSlug || descripcion;

  await prisma.product.update({
    where: { id },
    data: {
      sku,
      descripcion,
      referencia,
      slug: slugify(slugSource),
      imageUrl: asString(formData.get('imageUrl')),
      textoDescripcion: asString(formData.get('textoDescripcion')),
      categoryId: asNumber(formData.get('categoryId')) || null,
    },
  });
  revalidatePath('/admin/productos');
}

export async function deleteProduct(formData: FormData) {
  const id = Number(asString(formData.get('id')));
  if (!id) return;
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin/productos');
}

export async function createDistributor(formData: FormData) {
  const name = asString(formData.get('name'));
  if (!name) return;

  await prisma.distributor.create({
    data: {
      name,
      region: asString(formData.get('region')),
      phone: asString(formData.get('phone')),
      email: asString(formData.get('email')),
      address: asString(formData.get('address')),
    },
  });
  revalidatePath('/admin/distribuidores');
}

export async function createDistributorAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await createDistributor(formData);
    return ok('Distribuidor creado');
  } catch {
    return fail('No se pudo crear el distribuidor');
  }
}

export async function updateDistributorAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await updateDistributor(formData);
    return ok('Distribuidor actualizado');
  } catch {
    return fail('No se pudo actualizar el distribuidor');
  }
}

export async function deleteDistributorAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await deleteDistributor(formData);
    return ok('Distribuidor eliminado');
  } catch {
    return fail('No se pudo eliminar el distribuidor');
  }
}
export async function updateDistributor(formData: FormData) {
  const id = Number(asString(formData.get('id')));
  const name = asString(formData.get('name'));
  if (!id || !name) return;

  await prisma.distributor.update({
    where: { id },
    data: {
      name,
      region: asString(formData.get('region')),
      phone: asString(formData.get('phone')),
      email: asString(formData.get('email')),
      address: asString(formData.get('address')),
    },
  });
  revalidatePath('/admin/distribuidores');
}

export async function deleteDistributor(formData: FormData) {
  const id = Number(asString(formData.get('id')));
  if (!id) return;
  await prisma.distributor.delete({ where: { id } });
  revalidatePath('/admin/distribuidores');
}
