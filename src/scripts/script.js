document.addEventListener('DOMContentLoaded', () => {
  // Safely handle the old responsive navigation function if the element doesn't exist.
  if (document.getElementById('myTopnav')) {
    function myFunction() {
      var x = document.getElementById('myTopnav');
      if (x.className === 'topnav') {
        x.className += ' responsive';
      } else {
        x.className = 'topnav';
      }
    }
    // Make the function globally available if needed, otherwise it can be scoped here.
    window.myFunction = myFunction;
  }

  // Safely handle the contact form submission.
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      contactForm.style.display = 'none';
      const thankYouMessage = document.getElementById('thank-you-message');
      if (thankYouMessage) {
        thankYouMessage.style.display = 'block';
      }
    });
  }

  // Safely handle the theme switcher logic.
  const themeSwitcher = document.getElementById('theme-switcher');
  if (themeSwitcher) {
    const body = document.body;
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
      currentTheme = 'light-mode';
      localStorage.setItem('theme', currentTheme);
    }
    body.classList.add(currentTheme);

    const icon = themeSwitcher.querySelector('i');
    if (currentTheme === 'dark-mode') {
      icon.classList.remove('fa-moon-o');
      icon.classList.add('fa-sun-o');
    } else {
      icon.classList.remove('fa-sun-o');
      icon.classList.add('fa-moon-o');
    }

    themeSwitcher.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      let theme = 'light-mode';
      if (body.classList.contains('dark-mode')) {
        theme = 'dark-mode';
        icon.classList.remove('fa-moon-o');
        icon.classList.add('fa-sun-o');
      } else {
        icon.classList.remove('fa-sun-o');
        icon.classList.add('fa-moon-o');
      }
      localStorage.setItem('theme', theme);
    });
  }

  // Dynamic content loading from data.json
  fetch('data.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      // Populate About Me
      const aboutContent = document.getElementById('about-content');
      if (aboutContent) {
        aboutContent.textContent = data.personalInfo.aboutMe;
      }

      // Populate Skills
      const skillGroupsContainer = document.querySelector('.skill-groups');
      if (skillGroupsContainer) {
        for (const category in data.skills) {
          if (data.skills.hasOwnProperty(category)) {
            const skillGroupDiv = document.createElement('div');
            skillGroupDiv.classList.add('skill-group');

            const categoryHeading = document.createElement('h3');
            categoryHeading.textContent = category;
            skillGroupDiv.appendChild(categoryHeading);

            const skillsList = document.createElement('ul');
            skillsList.classList.add('skills-list');

            data.skills[category].forEach((skill) => {
              const li = document.createElement('li');
              li.innerHTML = `<i class="${skill.icon}"></i> ${skill.name}`;
              skillsList.appendChild(li);
            });
            skillGroupDiv.appendChild(skillsList);
            skillGroupsContainer.appendChild(skillGroupDiv);
          }
        }
      }

      // Populate Experience
      const experienceSection = document.querySelector(
        '#experience .experience-list'
      );
      if (experienceSection) {
        data.experience.forEach((exp) => {
          const expItem = document.createElement('div');
          expItem.classList.add('experience-item');
          expItem.innerHTML = `
              <h3>${exp.title}</h3>
              <p class="item-meta">${exp.company} | ${exp.duration}</p>
              <ul>
                  ${exp.responsibilities.map((resp) => `<li>${resp}</li>`).join('')}
              </ul>
          `;
          experienceSection.appendChild(expItem);
        });
      }

      // Populate Projects
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        data.projects.forEach((project) => {
          const projectItem = document.createElement('div');
          projectItem.classList.add('project-item');
          projectItem.innerHTML = `
              <h3>${project.title}</h3>
              <p class="item-meta"><a href="${project.link}" target="_blank">Live link</a></p>
              <p>${project.description}</p>
          `;
          projectsSection.appendChild(projectItem);
        });
      }

      // Populate Education
      const educationSection = document.getElementById('education');
      if (educationSection) {
        data.education.forEach((edu) => {
          const eduItem = document.createElement('div');
          eduItem.classList.add('education-item');
          eduItem.innerHTML = `
              <h3><i class="${edu.icon}"></i> ${edu.degree}</h3>
              <p class="item-meta"> ${edu.institution}</p>
              <div class="year-location-container">
                <p> <i class="fas fa-calendar-alt"></i> ${edu.year}</p>
                <p> <i class="fas fa-map-marker-alt"></i> Dhaka, Bangladesh</p>
              </div>
              ${edu.details
                .map((detail) => {
                  if (detail.startsWith('Notable Courses:')) {
                    const parts = detail.split(':');
                    return `<p class="notable-courses-text"><strong>${parts[0]}:</strong>${parts.slice(1).join(':')}</p>`;
                  } else {
                    return `<p>${detail}</p>`;
                  }
                })
                .join('')}
          `;
          educationSection.appendChild(eduItem);
        });
      }

      // Populate Social Links
      const socialIconsContainer = document.querySelector(
        '#find-me-online .social-icons'
      );
      if (socialIconsContainer) {
        data.socialLinks.forEach((link) => {
          const a = document.createElement('a');
          a.href = link.url;
          a.target = '_blank';
          a.classList.add('social-icon');
          a.setAttribute('aria-label', link.name);
          a.innerHTML = `<i class="fa ${link.icon}"></i>`;
          socialIconsContainer.appendChild(a);
        });
      }

      // Populate Footer
      const currentYear = document.getElementById('current-year');
      if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
      }
      const footerName = document.getElementById('footer-name');
      if (footerName) {
        footerName.textContent = data.personalInfo.name;
      }
    })
    .catch((error) => console.error('Error loading CV data:', error));
});
