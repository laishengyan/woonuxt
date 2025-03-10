export function useUtils() {
  // 打开loading
  const openLoading = () => {
    const loading = document.getElementById('loading');
    loading?.classList.remove('hide');
  }

  // 关闭loading
  function hideLoading() {
    const loading = document.getElementById('loading');
    loading?.classList.add('hide');
  }
  
  function getNowLanguage(value: Array<any>, local: any): any {
    return value.find((item: any) => item.code === local)?.title
  }

  function getNowLanguageSlug(value: Array<any>, local: any): any {
    return value.find((item: any) => item.code === local)?.slug
  }

  const localNum = (locale: string) => {
    switch (locale) {
      case 'en':
        return "EN";
      case 'de':
        return "DE";
      case 'ja':
        return "JA";
      case 'zh':
        return "ZH";
      default:
        return "EN";
    }
  }

  return { openLoading, hideLoading, getNowLanguage, getNowLanguageSlug, localNum };
}