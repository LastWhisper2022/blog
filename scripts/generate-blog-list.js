const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '../blog');
const OUTPUT_FILE = path.join(__dirname, '../src/data/blogPosts.json');

function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  
  const frontMatter = {};
  const lines = match[1].split('\n');
  
  lines.forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim();
      // Remove quotes if present
      const cleanValue = value.replace(/^['"](.*)['"]$/, '$1');
      // Handle array like [a, b]
      if (cleanValue.startsWith('[') && cleanValue.endsWith(']')) {
        frontMatter[key.trim()] = cleanValue.slice(1, -1).split(',').map(s => s.trim());
      } else {
        frontMatter[key.trim()] = cleanValue;
      }
    }
  });
  
  return frontMatter;
}

function generateBlogList() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error('Blog directory not found');
    return;
  }

  const files = fs.readdirSync(BLOG_DIR);
  const posts = [];

  files.forEach(file => {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) return;
    
    const filePath = path.join(BLOG_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontMatter = parseFrontMatter(content);
    
    if (frontMatter.title) {
      let permalink = '/blog/';
      if (frontMatter.slug) {
        permalink += frontMatter.slug.startsWith('/') ? frontMatter.slug.slice(1) : frontMatter.slug;
      } else {
        // Fallback to filename without extension
        permalink += file.replace(/\.(md|mdx)$/, '');
      }

      posts.push({
        id: file,
        title: frontMatter.title,
        date: frontMatter.date || new Date().toISOString().split('T')[0], // Fallback date
        permalink: permalink,
        tags: frontMatter.tags || [],
        description: frontMatter.description || '', // Assuming description might be in frontmatter
      });
    }
  });

  // Sort by date descending
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
  console.log(`Generated ${posts.length} blog posts in ${OUTPUT_FILE}`);
}

generateBlogList();
