export default function Criteria() {
  return (
    <div className="space-y-5 text-neutral-300">
      <img
        src={"/addmascot.png"}
        width={500}
        alt=""
        className="absolute z-10 top-20 ml-14 select-none"
      />
      <div className="relative overflow-hidden h-36 rounded-md border-[1px] border-neutral-800 text-white">
        <video
          src="https://static.rhythia.com/bg.mp4#t=10"
          className="mt-[-200px]"
          autoPlay
          muted
          loop
        ></video>
        <div className="absolute top-0 w-full h-full bg-neutral-900 opacity-70"></div>
        <div className="absolute top-0 w-full h-full z-10 flex flex-col items-end justify-center p-10">
          <div className="text-2xl font-bold">Ranking Criteria</div>
          <div className="text-xl font-thin">
            Ultimate guide to get your map into Ranking
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-bold -600 mb-4 text-white">
        Ranking Criteria
      </h1>

      <p className="mb-4">
        Learn how the map ranking works, this can come in handy when submitting
        maps for ranked section.
      </p>

      <h2 className="text-2xl font-semibold text-white mb-3">Introduction</h2>

      <p className="mb-4">The ranking process can be split into:</p>

      <ul className="list-disc ml-6 mb-4">
        <li>
          <strong>An objective part</strong>: the requirement evaluation, which
          should be the same for everyone.
        </li>
        <li>
          <strong>A subjective part</strong>: the map's execution and the song
          representation according to each mapper.
        </li>
      </ul>

      <p className="mb-4">Both of them will be explained in this page.</p>

      <h2 className="text-2xl font-semibold text-white mb-3">
        Beatmap Requirements
      </h2>

      <ul className="list-disc ml-6 mb-4">
        <li>Maps must be at least 30 seconds long.</li>
        <li>
          Maps should follow the content usage permissions; otherwise, the
          author can enforce your beatmap's removal.
        </li>
        <li>
          Maps must be possible without mods on. At least 1 verification pass is
          required to get the beatmap ranked.
        </li>
        <li>Maps must be FCable, no forced misses allowed.</li>
        <li>
          If meganotes are used, they should be spaced by 1.16 blocks at most.
        </li>
        <li>
          Maps should end near the end of the song, to avoid unskippable gaps.
        </li>
      </ul>

      <h3 className="text-xl font-semibold text-white mb-2">Spread</h3>
      <p className="mb-4">
        Difficulty names can be freely used. Of course, no offensive names are
        allowed. The default spread is: Easy -{">"} Medium -{">"} Hard -{">"}{" "}
        LOGIC? -{">"} Tasukete. The difficulty of the map should match the label
        used; that means an Easy map should abide by the Easy maps criteria.
      </p>

      <h3 className="text-xl font-semibold text-white mb-2">
        Difficulty-specific
      </h3>

      <h4 className="text-lg font-semibold text-white mb-2">Easy</h4>

      <ul className="list-disc ml-6 mb-4">
        <li>No jumps faster than 1/2 and no slides faster than 1/4.</li>
        <li>
          If Quantum is used, it should be either very slow or very simple.
        </li>
        <li>You may take a look at some archived maps to see some examples.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-white mb-3">
        Metadata Requirements
      </h2>

      <p className="mb-4">
        Metadata must be accurate. If there's another ranked map of the same
        song, all metadata should be reused from there.
      </p>

      <h3 className="text-xl font-semibold text-white mb-2">Title</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>The naming format is Artist - Song Name.</li>
        <li>
          Songs shortened for TV (e.g. anime opening) must have (TV Size).
        </li>
        <li>Game versions should be labeled as (Game Ver.).</li>
        <li>Short/Long versions should be labeled as (Short/Long Ver.).</li>
        <li>
          Official cuts/extensions should follow the author's intended original
          naming conventions. (e.g. (Game Edition.) instead of (Game Ver.))
        </li>
        <li>Unofficial cuts should be indicated as (Cut Ver.).</li>
        <li>Unofficial extensions should be indicated as (Extended Ver.).</li>
        <li>
          Tempo-increased songs should have (Sped Up Ver. / Speed Up Ver.) and
          those with pitch increase as well should have (Nightcore Ver.)
          instead.
        </li>
      </ul>

      <h3 className="text-xl font-semibold text-white mb-2">
        File Requirements
      </h3>

      <ul className="list-disc ml-6 mb-4">
        <li>
          Don't include inappropriate content. Explicit content may be allowed,
          to a certain extent.
        </li>
      </ul>

      <h3 className="text-xl font-semibold text-white mb-2">Song</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>At least 128kbps for any filetype.</li>
        <li>Use the same audio if mapping various difficulties.</li>
      </ul>

      <h3 className="text-xl font-semibold  mb-2">Cover</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>The cover should use a 1:1 aspect ratio (squared).</li>
        <li>
          If not using the album/source cover, please add a link to it on the
          description.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-white mb-3">
        Song Representation
      </h2>

      <p className="mb-4">
        This concept refers to every part of the map that can be seen in the
        editor:
      </p>

      <ul className="list-disc ml-6 mb-4">
        <li>
          <strong>Sync:</strong> How the notes in the map correspond to the
          sounds in the song.
        </li>
        <li>
          <strong>Structure:</strong> How each pattern in the song is
          represented.
        </li>
        <li>
          <strong>Emphasis:</strong> How noticeable each pattern in the song
          should be.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-white mb-3">
        General Guidelines
      </h2>

      <ul className="list-disc ml-6 mb-4">
        <li>
          Correlate the intensity of the map with the song. If the song gets
          more intense the map should too, and vice versa.
        </li>
        <li>This should be translated into:</li>
        <ul className="list-disc ml-6 mb-4">
          <li>Wider/shorter spacing</li>
          <li>Note density</li>
          <li>Rhythmic complexity</li>
        </ul>
        <li>
          Make good usage of contrast. When you enter a new section of the song,
          apply your ideas differently.
        </li>
        <li>
          If there's a sound that needs emphasis, reflect it by deviating from
          your standard mapping choices.
        </li>
        <li>Stay consistent; keep your ideas consistent throughout the map.</li>
        <li>
          It's recommended to assign patterns to melodies and sounds in the
          song.
        </li>
        <li>
          In case copy-pasting makes the map feel bland, change the map in a
          subtle way to avoid repetition. You could use vertical and horizontal
          flips to your advantage.
        </li>
        <li>
          Every note in the map should match a sound in the song, but not the
          other way around necessarily. This leaves space for undermapping and
          overmapping, but consider when to do so.
        </li>
        <li>
          Try making your interpretation of the map as clear as possible;
          otherwise, other people will not understand your mapping choices!
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-white mb-3">Exceptions</h2>

      <ul className="list-disc ml-6 mb-4">
        <li>
          Undermapping is allowed and encouraged for any of the lower
          difficulties.
        </li>
        <li>
          Overmapping can be done on LOGIC?+ difficulties as long as it fits the
          song and fits within the difficulty scaling.
        </li>
      </ul>
    </div>
  );
}
