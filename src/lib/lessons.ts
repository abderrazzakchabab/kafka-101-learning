import fs from 'fs'
import path from 'path'
export { LESSON_META } from './lessons-meta'
export type { LessonMeta } from './lessons-meta'
import { LESSON_META } from './lessons-meta'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export function getLessonContent(slug: string): string {
  const meta = LESSON_META.find(l => l.slug === slug)
  if (!meta || !meta.file) return ''
  return fs.readFileSync(path.join(CONTENT_DIR, meta.file), 'utf-8')
}

export function getAllLessons() {
  return LESSON_META
}
