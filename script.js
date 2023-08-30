// 일단 입력 받기
const $input = document.querySelector('input');
console.log($input);

// user api 불러오는 함수
function User_API(user) {
  const result = fetch(`https://api.github.com/users/${user}`)
  .then(res => res.json())
  .catch(err => console.error(err));

  return result;
}

// user repos api 불러오는 함수
function User_Repos_API(user) {
  const result = fetch(`https://api.github.com/users/${user}/repos`)
  .then(res => res.json())
  .catch(err => console.error(err));

  return result;
}

function Print_repos(latest_repos, $repos) {
  console.log($repos);
  latest_repos.map((repo) => {
    // 아 그냥 jsx 쓸까...?
    const $repo = document.createElement('div');
    $repo.classList.add('repo');

    const $repo_name = document.createElement('a');
    $repo_name.setAttribute('href', repo.html_url);
    $repo_name.textContent = repo.name;

    const $repo_buttons = document.createElement('div');
    $repo_buttons.classList.add('buttons');

    const $star_btn = document.createElement('button');
    const $watchers_btn = document.createElement('button');
    const $forks_btn = document.createElement('button');

    $star_btn.textContent = `Stars: ${repo.stargazers_count}`;
    $watchers_btn.textContent = `Watchers: ${repo.watchers_count}`;
    $forks_btn.textContent = `Forks: ${repo.forks_count}`;

    $repo_buttons.appendChild($star_btn);
    $repo_buttons.appendChild($watchers_btn);
    $repo_buttons.appendChild($forks_btn);

    $repo.appendChild($repo_name);
    $repo.appendChild($repo_buttons);

    $repos.appendChild($repo);

  })
}

$input.addEventListener('input', async (value) => {
  // 근데 값을 어떻게 들고오지?
  console.log($input.value);

  // input 입력될 때 마다 api 호출
  let infos = await User_API($input.value);
  console.log(infos);

  // --------------------- //
  // 이제 값 저장해야함
  // 저장할 요소 확인

  // 프로필 이미지
  $profile_img = document.querySelector('.profile_img_btn > img');
  console.log($profile_img);

  // 프로필 이미지 - src 경로 추가
  $profile_img.setAttribute('src', infos.avatar_url);

  // 프로필 버튼 - url 이동
  $profile_btn = document.querySelector('.profile_img_btn > a');
  $profile_btn.setAttribute('href', infos.html_url);

  // public_repos 확인 및 내용 수정
  const $public_repos = document.querySelector('#public_repos');
  $public_repos.textContent = `Public Repos: ${infos.public_repos}`;

  // public_gists
  const $public_gists = document.querySelector('#public_gists');
  $public_gists.textContent = `Public Gists: ${infos.public_gists}`;

  // followers
  const $followers = document.querySelector('#followers');
  $followers.textContent = `Followers: ${infos.followers}`;

  // following
  const $following = document.querySelector('#following');
  $following.textContent = `Following: ${infos.following}`;


  // ---------------------

  // 표의 내용 채우기
  const $company = document.querySelector('#company');
  $company.textContent = `Company: ${infos.company || ''}`;

  const $location = document.querySelector('#location');
  $location.textContent = `Location: ${infos.location || ''}`;

  const $blog = document.querySelector('#blog');
  $blog.textContent = `Website/Blog: ${infos.blog}`;
  
  const $created_at = document.querySelector('#created_at');
  $created_at.textContent = `Member Since: ${infos.created_at.split('T')[0]}`;


  // -----------------------
  // latest repos
  const $repos = document.querySelector('.repos');
  
  // 만약, 레포가 있으면 노드 만들어서 repos 밑에 붙이기 -> repos_list map으로 돌리기
  const repos_list = await User_Repos_API($input.value);

  // created_at 보고 최신거 확인해서 5개 추림
  const latest_repos = repos_list.sort((a, b) => a.created_at < b.created_at ? 1 : -1).slice(0, 5)

  // const latest_repos = repos_list.slice(0, 5);
  console.log(repos_list);
  console.log(latest_repos);

  // latest_repose 만큼 돌기
  Print_repos(latest_repos, $repos);

})

