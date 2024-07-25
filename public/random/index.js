function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const topOffset = section.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: topOffset - 70,
        behavior: 'smooth'
      });
    }
  }

